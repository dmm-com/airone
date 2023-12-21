from airone.lib.test import AironeViewTest
from airone.lib.types import AttrTypeValue
from trigger.models import TriggerCondition
from user.models import User


class APITest(AironeViewTest):
    def setUp(self):
        super(APITest, self).setUp()

        self.user: User = self.guest_login()

    def test_list_trigger_condition(self):
        # create Entity and TriggerConditions to be retrieved
        entity = self.create_entity(
            self.user,
            "test_entity",
            attrs=[
                {"name": "foo", "type": AttrTypeValue["string"]},
                {"name": "bar", "type": AttrTypeValue["object"]},
                {"name": "hoge", "type": AttrTypeValue["string"]},
            ],
        )
        another_entity = self.create_entity(
            self.user,
            "another_entity",
            attrs=[
                {"name": "is_orphan", "type": AttrTypeValue["boolean"]},
                {"name": "name", "type": AttrTypeValue["string"]},
            ],
        )
        ref_entry = self.add_entry(self.user, "e0", another_entity)

        # create TriggerCondition for test_entity
        settingTriggerActions = [
            {"attr_id": entity.attrs.get(name="hoge").id, "value": "changed_value"},
        ]
        TriggerCondition.register(
            entity,
            [
                {"attr_id": entity.attrs.get(name="foo").id, "cond": "hoge"},
                {"attr_id": entity.attrs.get(name="bar").id, "cond": ref_entry},
            ],
            settingTriggerActions,
        )
        TriggerCondition.register(
            entity,
            [
                {"attr_id": entity.attrs.get(name="bar").id, "cond": ref_entry},
            ],
            settingTriggerActions,
        )

        # create TriggerCondition for another_entity
        TriggerCondition.register(
            another_entity,
            [
                {"attr_id": another_entity.attrs.get(name="is_orphan").id, "cond": True},
            ],
            [
                {"attr_id": another_entity.attrs.get(name="name").id, "value": "John Doe"},
            ],
        )

        # list all trigger has expected values
        resp = self.client.get("/trigger/api/v2/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(
            [t["entity"]["name"] for t in resp.json()["results"]],
            [
                entity.name,
                entity.name,
                another_entity.name,
            ],
        )

        # list specified Entity's triggers
        resp = self.client.get("/trigger/api/v2/?entity_id=%s" % entity.id)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(
            [t["entity"]["name"] for t in resp.json()["results"]],
            [
                entity.name,
                entity.name,
            ],
        )
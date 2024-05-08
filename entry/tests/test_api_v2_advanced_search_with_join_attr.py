import json

from airone.lib.elasticsearch import FilterKey
from airone.lib.types import AttrTypeValue
from entity.models import Entity
from entry.tests.test_api_v2 import BaseViewTest


class ViewTest(BaseViewTest):
    def setUp(self):
        super(ViewTest, self).setUp()

        # create Items to be search by join_attrs parameter
        ref_entries = [
            self.add_entry(
                self.user,
                "RefEntry-%s" % i,
                self.ref_entity,
                values={
                    "val": "hoge-%s" % i if i % 2 == 0 else "",
                    "ref": self.ref_entry.id,
                    "name": {"name": "abcd-%s" % i, "id": self.ref_entry.id},
                },
            )
            for i in range(2)
        ]

        # create Items that are search by ordinary processing
        for index, (val, ref_id, refs) in enumerate(
            [
                ("foo", ref_entries[0].id, []),
                ("bar", ref_entries[0].id, []),
                ("baz", ref_entries[1].id, []),
                ("qux", None, ref_entries),
            ]
        ):
            self.add_entry(
                self.user,
                "Entry%s" % index,
                self.entity,
                values={
                    "val": val,
                    "ref": ref_id,
                    "name": {"name": "fuga", "id": ref_id},
                    "refs": [r.id for r in refs],
                    "names": [{"name": "fuga-%s" % index, "id": r.id} for r in refs],
                },
            )

    def test_join_attr_for_array_object(self):
        params = {
            "entities": [self.entity.id],
            "attrinfo": [],
            "join_attrs": [
                {
                    "name": "refs",
                    "attrinfo": [
                        {"name": "val"},
                    ],
                },
            ],
        }
        resp = self.client.post(
            "/entry/api/v2/advanced_search/", json.dumps(params), "application/json"
        )
        self.assertEqual(resp.status_code, 200)

        # prepare comparison data with returned result
        expected_results = [
            ("Entry0", {"refs.val": {"as_string": ""}}),
            ("Entry1", {"refs.val": {"as_string": ""}}),
            ("Entry2", {"refs.val": {"as_string": ""}}),
            ("Entry3", {"refs.val": {"as_string": "hoge-0"}}),
            ("Entry3", {"refs.val": {"as_string": ""}}),
        ]
        # check returned processing has expected values
        for index, result in enumerate(resp.json()["values"]):
            (e_name, e_attrinfo) = expected_results[index]
            self.assertEqual(result["entry"]["name"], e_name)

            for attrname, attrvalue in e_attrinfo.items():
                self.assertEqual(result["attrs"][attrname]["value"], attrvalue)

    def test_join_attr_for_array_named_object(self):
        params = {
            "entities": [self.entity.id],
            "attrinfo": [],
            "join_attrs": [
                {
                    "name": "names",
                    "attrinfo": [
                        {"name": "val"},
                    ],
                },
            ],
        }
        resp = self.client.post(
            "/entry/api/v2/advanced_search/", json.dumps(params), "application/json"
        )
        self.assertEqual(resp.status_code, 200)

        # prepare comparison data with returned result
        expected_results = [
            ("Entry0", {"names.val": {"as_string": ""}}),
            ("Entry1", {"names.val": {"as_string": ""}}),
            ("Entry2", {"names.val": {"as_string": ""}}),
            ("Entry3", {"names.val": {"as_string": "hoge-0"}}),
            ("Entry3", {"names.val": {"as_string": ""}}),
        ]
        # check returned processing has expected values
        for index, result in enumerate(resp.json()["values"]):
            (e_name, e_attrinfo) = expected_results[index]
            self.assertEqual(result["entry"]["name"], e_name)

            for attrname, attrvalue in e_attrinfo.items():
                self.assertEqual(result["attrs"][attrname]["value"], attrvalue)

    def test_basic_join_attr_feature(self):
        # send request to search Entries with join_attrs
        params = {
            "entities": [self.entity.id],
            "attrinfo": [
                {"name": "val"},
                {"name": "ref"},
                {"name": "name"},
            ],
            "join_attrs": [
                {
                    "name": "ref",
                    "attrinfo": [
                        {"name": "val"},
                        {"name": "ref"},
                        {"name": "name"},
                    ],
                },
                {
                    "name": "name",
                    "attrinfo": [
                        {"name": "val"},
                        {"name": "ref"},
                        {"name": "name"},
                    ],
                },
            ],
        }
        resp = self.client.post(
            "/entry/api/v2/advanced_search/", json.dumps(params), "application/json"
        )
        self.assertEqual(resp.status_code, 200)

        # prepare comparison data with returned result
        REF_DATA = {"id": self.ref_entry.id, "name": self.ref_entry.name}
        expected_results = [
            (
                "Entry0",
                {
                    "ref.val": {"as_string": "hoge-0"},
                    "ref.ref": {"as_object": REF_DATA},
                    "ref.name": {"as_named_object": {"name": "abcd-0", "object": REF_DATA}},
                    "name.val": {"as_string": "hoge-0"},
                    "name.ref": {"as_object": REF_DATA},
                    "name.name": {"as_named_object": {"name": "abcd-0", "object": REF_DATA}},
                },
            ),
            (
                "Entry1",
                {
                    "ref.val": {"as_string": "hoge-0"},
                    "ref.ref": {"as_object": REF_DATA},
                    "ref.name": {"as_named_object": {"name": "abcd-0", "object": REF_DATA}},
                    "name.val": {"as_string": "hoge-0"},
                    "name.ref": {"as_object": REF_DATA},
                    "name.name": {"as_named_object": {"name": "abcd-0", "object": REF_DATA}},
                },
            ),
            (
                "Entry2",
                {
                    "ref.val": {"as_string": ""},
                    "ref.ref": {"as_object": REF_DATA},
                    "ref.name": {"as_named_object": {"name": "abcd-1", "object": REF_DATA}},
                    "name.val": {"as_string": ""},
                    "name.ref": {"as_object": REF_DATA},
                    "name.name": {"as_named_object": {"name": "abcd-1", "object": REF_DATA}},
                },
            ),
            (
                "Entry3",
                {
                    "ref.val": {"as_string": ""},
                    "ref.ref": {"as_string": ""},
                    "ref.name": {"as_string": ""},
                    "name.val": {"as_string": ""},
                    "name.ref": {"as_string": ""},
                    "name.name": {"as_string": ""},
                },
            ),
        ]

        # check returned processing has expected values
        for index, result in enumerate(resp.json()["values"]):
            (e_name, e_attrinfo) = expected_results[index]
            self.assertEqual(result["entry"]["name"], e_name)

            for attrname, attrvalue in e_attrinfo.items():
                self.assertEqual(result["attrs"][attrname]["value"], attrvalue)

    def test_join_attr_with_keyword(self):
        # This sends request with keyword in join_attrs parameter and
        # confirms filter processing works with its filter parameter of attrinfo
        params = {
            "entities": [self.entity.id],
            "attrinfo": [
                {"name": "val", "keyword": "bar"},
                {"name": "ref"},
            ],
            "join_attrs": [
                {
                    "name": "ref",
                    "attrinfo": [
                        {"name": "val", "keyword": "hoge-0"},
                    ],
                },
            ],
        }
        resp = self.client.post(
            "/entry/api/v2/advanced_search/", json.dumps(params), "application/json"
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual([x["entry"]["name"] for x in resp.json()["values"]], ["Entry1"])

        # This sends request with join_attrs that have filter_key to get empty Items
        params = {
            "entities": [self.entity.id],
            "attrinfo": [],
            "join_attrs": [
                {
                    "name": "ref",
                    "attrinfo": [
                        {"name": "val", "filter_key": FilterKey.EMPTY},
                    ],
                },
            ],
        }
        resp = self.client.post(
            "/entry/api/v2/advanced_search/", json.dumps(params), "application/json"
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual([x["entry"]["name"] for x in resp.json()["values"]], ["Entry2"])
        self.assertEqual(
            [x["attrs"]["ref.val"]["value"] for x in resp.json()["values"]], [{"as_string": ""}]
        )

        # This sends request with join_attrs that have filter_key to get non-empty Items
        params = {
            "entities": [self.entity.id],
            "attrinfo": [],
            "join_attrs": [
                {
                    "name": "ref",
                    "attrinfo": [
                        {"name": "val", "filter_key": FilterKey.NON_EMPTY},
                    ],
                },
            ],
        }
        resp = self.client.post(
            "/entry/api/v2/advanced_search/", json.dumps(params), "application/json"
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual([x["entry"]["name"] for x in resp.json()["values"]], ["Entry0", "Entry1"])
        self.assertEqual(
            [x["attrs"]["ref.val"]["value"] for x in resp.json()["values"]],
            [
                {"as_string": "hoge-0"},
                {"as_string": "hoge-0"},
            ],
        )

    def test_recursive_join_attr(self):
        entity: Entity = self.create_entity(
            **{
                "user": self.user,
                "name": "entity",
                "attrs": [
                    {"name": "top", "type": AttrTypeValue["object"], "ref": self.ref_entity},
                ],
            }
        )
        # Create items that has following referral structure
        # I0.ref -> I1.ref -> I2
        item2 = self.add_entry(self.user, "I2", self.ref_entity, values={"text": "puyo"})
        item1 = self.add_entry(self.user, "I1", self.ref_entity, values={
            "ref": item2,
            "text": "fuga",
        })
        item0 = self.add_entry(
            self.user, "I0", self.ref_entity, values={
                "val": "hoge",
                "ref": item1,
                "refs": [item2],
            }
        )

        entry = self.add_entry(
            self.user,
            "entry",
            entity,
            values={
                "top": item0,
            },
        )

        params = {
            "entities": [entity.id],
            "attrinfo": [],
            "join_attrs": [
                {
                    "name": "top",
                    "attrinfo": [{"name": "val"}, {"name": "ref"}],
                    "join_attrs": [{
                        "name": "ref",
                        "attrinfo": [{"name": "text"}, {"name": "ref"}],
                        "join_attrs": [{
                            "name": "ref",
                            "attrinfo": [{"name": "text"}],
                            "join_attrs": [],
                        }]
                    }],
                },
            ],
        }
        resp = self.client.post(
            "/entry/api/v2/advanced_search/", json.dumps(params), "application/json"
        )
        self.assertEqual(resp.status_code, 200)

        self.assertEqual(resp.json()["entry"]["name"], entry.name)
        self.assertEqual(resp.json()["entry"]["id"], entry.id)

        print("[onix-test(00)] %s" % resp.json())
        for v in resp.json()["values"]:
            print("  [onix-test(10)] %s" % v["entry"]["name"])

            for name, value in v["attrs"].items():
                print("    [onix-test(20)] %s: %s" % (name, str(value)))

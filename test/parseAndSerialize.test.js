"use strict";

const CapabilityToken = require("capability-token");
const crypto = require("crypto");
const URLSafeBase64 = require("urlsafe-base64");

const CapabilityURI = require("../index.js");

test("serializes and parses IP URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityURI(
            {
                authority: "127.0.0.1",
                capabilityToken: token
            }
        );
        expect(CapabilityURI.parse(uri.serialize())).toEqual(uri);
    }
);

test("serializes and parses DNS URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityURI(
            {
                authority: "example.com",
                capabilityToken: token
            }
        );
        expect(CapabilityURI.parse(uri.serialize())).toEqual(uri);
    }
);

test("serializes and parses capability authority URI", () =>
    {
        const capabilityAuthority = URLSafeBase64.encode(crypto.randomBytes(64));
        const token = new CapabilityToken();
        const uri = new CapabilityURI(
            {
                capabilityAuthority,
                capabilityToken: token
            }
        );
        expect(CapabilityURI.parse(uri.serialize())).toEqual(uri);
    }
);

test("serializes and parses capability authority with authority scheme URI", () =>
    {
        const authorityScheme = "dht";
        const capabilityAuthority = URLSafeBase64.encode(crypto.randomBytes(64));
        const token = new CapabilityToken();
        const uri = new CapabilityURI(
            {
                authorityScheme,
                capabilityAuthority,
                capabilityToken: token
            }
        );
        expect(CapabilityURI.parse(uri.serialize())).toEqual(uri);
    }
);

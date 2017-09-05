"use strict";

const CapabilityToken = require("capability-token");
const crypto = require("crypto");
const UrlSafeBase64 = require("urlsafe-base64");

const CapabilityUri = require("../index.js");

test("serializes and parses IP URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                authority: "127.0.0.1",
                capabilityToken: token
            }
        );
        expect(CapabilityUri.parse(uri.serialize())).toEqual(uri);
    }
);

test("serializes and parses DNS URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                authority: "example.com",
                capabilityToken: token
            }
        );
        expect(CapabilityUri.parse(uri.serialize())).toEqual(uri);
    }
);

test("serializes and parses capability authority URI", () =>
    {
        const capabilityAuthority = UrlSafeBase64.encode(crypto.randomBytes(64));
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                capabilityAuthority,
                capabilityToken: token
            }
        );
        expect(CapabilityUri.parse(uri.serialize())).toEqual(uri);
    }
);

test("serializes and parses capability authority with authority scheme URI", () =>
    {
        const authorityScheme = "dht";
        const capabilityAuthority = UrlSafeBase64.encode(crypto.randomBytes(64));
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                authorityScheme,
                capabilityAuthority,
                capabilityToken: token
            }
        );
        expect(CapabilityUri.parse(uri.serialize())).toEqual(uri);
    }
);

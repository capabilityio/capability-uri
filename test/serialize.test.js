"use strict";

const CapabilityToken = require("capability-token");
const crypto = require("crypto");
const URLSafeBase64 = require("urlsafe-base64");

const CapabilityURI = require("../index.js");

test("serializes IP URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityURI(
            {
                authority: "127.0.0.1",
                capabilityToken: token
            }
        );
        expect(uri.serialize()).toEqual(`cpblty://127.0.0.1/#${token.serialize()}`);
    }
);

test("serializes DNS URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityURI(
            {
                authority: "example.com",
                capabilityToken: token
            }
        );
        expect(uri.serialize()).toEqual(`cpblty://example.com/#${token.serialize()}`);
    }
);

test("serializes capability authority URI", () =>
    {
        const capabilityAuthority = URLSafeBase64.encode(crypto.randomBytes(64));
        const token = new CapabilityToken();
        const uri = new CapabilityURI(
            {
                capabilityAuthority,
                capabilityToken: token
            }
        );
        expect(uri.serialize()).toEqual(`cpblty:${capabilityAuthority}:${token.serialize()}`);
    }
);

test("serializes capability authority with authority scheme URI", () =>
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
        expect(uri.serialize()).toEqual(`cpblty:${capabilityAuthority}@${authorityScheme}:${token.serialize()}`);
    }
);

"use strict";

const CapabilityToken = require("capability-token");
const CapabilityURI = require("../index.js");
const crypto = require("crypto");
const URLSafeBase64 = require("urlsafe-base64");

test("no cpblty scheme returns false", () =>
    {
        [
            "http", "https", "tcp", "git", "ssh"
        ]
        .map(scheme =>
            {
                expect(CapabilityURI.parse(`${scheme}://example.com/#${new CapabilityToken().serialize()}`)).toBe(false);
            }
        );
    }
);

test("invalid capability token returns false", () =>
    {
        [
            null, undefined, 17, "", "bleh", "Bearer foo"
        ]
        .map(invalid =>
            {
                expect(CapabilityURI.parse(`cpblty://example.com/#${invalid}`)).toBe(false);
            }
        );
    }
);

describe("IP URI", () =>
{
    it("returns parsed URI", () =>
        {
            const token = new CapabilityToken();
            expect(
                CapabilityURI.parse(`cpblty://127.0.0.1/#${token.serialize()}`)
            ).toEqual(
                new CapabilityURI(
                    {
                        authority: "127.0.0.1",
                        capabilityToken: token
                    }
                )
            );
        }
    );
});

describe("DNS URI", () =>
{
    it("returns parsed URI", () =>
        {
            const token = new CapabilityToken();
            expect(
                CapabilityURI.parse(`cpblty://example.com/#${token.serialize()}`)
            ).toEqual(
                new CapabilityURI(
                    {
                        authority: "example.com",
                        capabilityToken: token
                    }
                )
            );
        }
    );
});

describe("Capability authority URI", () =>
{
    it("returns parsed URI", () =>
        {
            const capabilityAuthority = URLSafeBase64.encode(crypto.randomBytes(64));
            const token = new CapabilityToken();
            expect(
                CapabilityURI.parse(`cpblty:${capabilityAuthority}:${token.serialize()}`)
            ).toEqual(
                new CapabilityURI(
                    {
                        capabilityAuthority,
                        capabilityToken: token
                    }
                )
            );
        }
    );
});

describe("Capability authority with authority scheme URI", () =>
{
    it("returns parsed URI", () =>
        {
            const authorityScheme = "dht";
            const capabilityAuthority = URLSafeBase64.encode(crypto.randomBytes(64));
            const token = new CapabilityToken();
            expect(
                CapabilityURI.parse(`cpblty:${capabilityAuthority}@${authorityScheme}:${token.serialize()}`)
            ).toEqual(
                new CapabilityURI(
                    {
                        authorityScheme,
                        capabilityAuthority,
                        capabilityToken: token
                    }
                )
            );
        }
    );
});

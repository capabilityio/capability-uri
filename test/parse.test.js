"use strict";

const CapabilityToken = require("capability-token");
const CapabilityUri = require("../index.js");
const crypto = require("crypto");
const UrlSafeBase64 = require("urlsafe-base64");

test("no cpblty scheme returns false", () =>
    {
        [
            "http", "https", "tcp", "git", "ssh"
        ]
        .map(scheme =>
            {
                expect(CapabilityUri.parse(`${scheme}://example.com/#${new CapabilityToken().serialize()}`)).toBe(false);
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
                expect(CapabilityUri.parse(`cpblty://example.com/#${invalid}`)).toBe(false);
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
                CapabilityUri.parse(`cpblty://127.0.0.1/#${token.serialize()}`)
            ).toEqual(
                new CapabilityUri(
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
                CapabilityUri.parse(`cpblty://example.com/#${token.serialize()}`)
            ).toEqual(
                new CapabilityUri(
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
            const capabilityAuthority = UrlSafeBase64.encode(crypto.randomBytes(64));
            const token = new CapabilityToken();
            expect(
                CapabilityUri.parse(`cpblty:${capabilityAuthority}:${token.serialize()}`)
            ).toEqual(
                new CapabilityUri(
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
            const capabilityAuthority = UrlSafeBase64.encode(crypto.randomBytes(64));
            const token = new CapabilityToken();
            expect(
                CapabilityUri.parse(`cpblty:${capabilityAuthority}@${authorityScheme}:${token.serialize()}`)
            ).toEqual(
                new CapabilityUri(
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

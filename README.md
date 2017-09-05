# capability-uri

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/capability-uri.png)](http://npmjs.org/package/capability-uri)

## Contributors

[@tristanls](https://github.com/tristanls)

## Contents

  * [Overview](#overview)
  * [Installation](#installation)
  * [Tests](#tests)
  * [Usage](#usage)
  * [Documentation](#documentation)
  * [Releases](#releases)

## Overview

This module documents the capability URI scheme and provides a reference implementation for generating and parsing capability URIs.

### Capability URI Scheme

The "cpblty" scheme is used to identify capabilities.

There are two types of "cpblty" URIs. They are distinguished by the mechanism used
to identify the authority responsible for resolving the capability.

The first type of capability URI uses IP address or DNS resolution to identify
authority.

The second type of capability URI uses first path part of the URI to identify the
authority responsible for resolving the capability, allowing for non-IP and non-DNS
resolution mechanisms.

The scheme-specific syntax and semantics of capability URIs are as follows:

```
capability_URI = "cpblty:" "//" authority "/#" capability_token
               / "cpblty:" capability_authority [ "@" authority_scheme ] ":" capability_token
authority_scheme =  ALPHA *( ALPHA / DIGIT / "-" / "_" )
capability_authority = base64url
capability_token = "CPBLTY" version "-" base64url
```

The semantics are such that the identified `authority` is the domain containing
the capability specified by the `capability_token`. For full specification of `authority`,
see [RFC 3986, Section 3.2 - Authority](https://tools.ietf.org/html/rfc3986#section-3.2).
Alternatively, the `capability_authority`, in combination with optional `authority_scheme`,
is the authority containing the capability specified by the `capability_token`.
The string `CPBLTY` is a well-known string to facilitate searches for leaked capabilities.
`version` is the numeric version of `capability_token` used. `base64url` is URL-safe base64
encoded bytes of the specified capability.

### Examples

Capability URI using `example.com` registered DNS name to designate authority:
```
cpblty://example.com/#CPBLTY1-IbwNerN4Dw4BYlpYc4Az-pNBWen_WsdrTrpb-HmMiJOEHvCv1xHKBn2Q
```

Capability URI using `DkDvHuU78RZGUeNs3Q-Wsw` authority to be interpreted using a
custom `my_dht` resolution scheme:
```
cpblty:DkDvHuU78RZGUeNs3Q-Wsw@my_dht:CPBLTY1-IbwNerN4Dw4BYlpYc4Az-pNBWen_WsdrTrpb-HmMiJOEHvCv1xHKBn2Q
```

Capability URI using `DkDvHuU78RZGUeNs3Q-Wsw` authority with an implied resolution scheme:
```
cpblty:DkDvHuU78RZGUeNs3Q-Wsw:CPBLTY1-IbwNerN4Dw4BYlpYc4Az-pNBWen_WsdrTrpb-HmMiJOEHvCv1xHKBn2Q
```

## Installation

    npm install capability-uri

## Tests

    npm test

## Usage

```javascript
const CapabilityToken = require("capability-token");
const CapabilityUri = require("capability-uri");
const crypto = require("crypto");
const UrlSafeBase64 = require("urlsafe-base64");

const uri1 = CapabilityUri.parse(`cpblty://example.com/#${new CapabilityToken().serialize()}`);
console.log(uri1);
console.log(uri1.serialize());

const uri2 = new CapabilityUri(
    {
        authority: "example.com",
        capabilityToken: new CapabilityToken()
    }
);
console.log(uri2);
console.log(uri2.serialize());

const uri3 = new CapabilityUri(
    {
        capabilityAuthority: UrlSafeBase64.encode(crypto.randomBytes(64)),
        capabilityToken: new CapabilityToken()
    }
);
console.log(uri3);
console.log(uri3.serialize());

const uri4 = new CapabilityUri(
    {
        authorityScheme: "dht",
        capabilityAuthority: UrlSafeBase64.encode(crypto.randomBytes(64)),
        capabilityToken: new CapabilityToken()
    }
);
console.log(uri4);
console.log(uri4.serialize());
```

## Documentation

### CapabilityUri

#### IP/DNS Capability URI

  * `authority`: _String_ Domain containing the capability specified by the `capabilityToken`. For full specification of `authority`, see [RFC 3986, Section 3.2 - Authority](https://tools.ietf.org/html/rfc3986#section-3.2).
  * `capabilityToken`: _CapabilityToken_ `CapabilityToken` instance.

#### Other Capability URI

  * `authorityScheme`: _String_ _(Default: undefined)_ Optional authority scheme.
  * `capabilityAuthority`: _String_ Base64url encoded authority containing the capability specified by the `capabilityToken`.
  * `capabilityToken`: _CapabilityToken_ `CapabilityToken` instance.

**Public API**
  * [CapabilityUri.parse(uri)](#capabilityuriparseuri)
  * [new CapabilityUri(config)](#new-capabilityuriconfig)
  * [capabilityUri.serialize()](#capabilityuriserialize)

#### CapabilityUri.parse(uri)

  * `uri`: _String_ String capability URI to parse.
  * Return: _CapabilityUri_ Parsed capability URI, either IP/DNS type or Other type.

#### new CapabilityUri(config)

  * `config`: _Object_ configuration.
    * `authority`: _String_ Domain containing the capability specified by the `capabilityToken`. For full specification of `authority`, see [RFC 3986, Section 3.2 - Authority](https://tools.ietf.org/html/rfc3986#section-3.2). Mutually exclusive with `capabilityAuthority`.
    * `authorityScheme`: _String_ _(Default: undefined)_ Optional authority scheme.
    * `capabilityAuthority`: _String_ Base64url encoded authority containing the capability specified by the `capabilityToken`. Mutually exclusive with `authority`.
    * `capabilityToken`: _CapabilityToken_ `CapabilityToken` instance.
  * Return: _CapabilityUri_ Capability URI instance as configured.

Creates a new `CapabilityUri` instance as configured.

#### capabilityUri.serialize()

  * Return: _String_ Capability URI.

Serializes `capabilityUri` into a string in URI format.

## Releases

[Current releases](https://github.com/capabilityio/capability-token/releases).

### Policy

We follow the semantic versioning policy ([semver.org](http://semver.org/)) with a caveat:

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
>MAJOR version when you make incompatible API changes,<br/>
>MINOR version when you add functionality in a backwards-compatible manner, and<br/>
>PATCH version when you make backwards-compatible bug fixes.

**caveat**: Major version zero is a special case indicating development version that may make incompatible API changes without incrementing MAJOR version.

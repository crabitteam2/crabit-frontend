#!/usr/bin/env node

import { runBalanceCli } from "../src/e2e/cli.mjs";

process.exitCode = await runBalanceCli(process.argv.slice(2));

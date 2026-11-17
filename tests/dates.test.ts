// Lancer avec : npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { isoVersParis, parisVersISO } from "../lib/dates.ts";

test("heure d'hiver : Paris = UTC+1", () => {
  assert.equal(parisVersISO("2026-11-16T12:30"), "2026-11-16T11:30:00.000Z");
  assert.equal(isoVersParis("2026-11-16T11:30:00.000Z"), "2026-11-16T12:30");
});

test("heure d'été : Paris = UTC+2", () => {
  assert.equal(parisVersISO("2026-07-14T20:00"), "2026-07-14T18:00:00.000Z");
  assert.equal(isoVersParis("2026-07-14T18:00:00.000Z"), "2026-07-14T20:00");
});

test("autour des changements d'heure", () => {
  // passage à l'heure d'été le 29 mars 2026 à 2h, à l'heure d'hiver le 25 octobre 2026 à 3h
  assert.equal(parisVersISO("2026-03-29T01:30"), "2026-03-29T00:30:00.000Z");
  assert.equal(parisVersISO("2026-03-29T03:30"), "2026-03-29T01:30:00.000Z");
  assert.equal(parisVersISO("2026-10-25T01:30"), "2026-10-24T23:30:00.000Z");
  assert.equal(parisVersISO("2026-10-25T04:00"), "2026-10-25T03:00:00.000Z");
});

test("aller-retour stable", () => {
  for (const local of ["2026-01-01T00:00", "2026-06-30T23:59", "2026-12-31T23:59"]) {
    assert.equal(isoVersParis(parisVersISO(local)), local);
  }
});

test("valeurs vides ou invalides", () => {
  assert.equal(parisVersISO(""), null);
  assert.equal(parisVersISO("n'importe quoi"), null);
  assert.equal(isoVersParis(null), "");
});

import test from "node:test";
import assert from "node:assert/strict";
import { validateProductInput } from "../src/utils/validation.js";

const validProduct = {
  name: "Everyday Tee",
  collection: "Offcut",
  price: 45,
  currency: "EUR",
  image: "https://cdn.example.com/product.webp",
  category: "Streetwear",
  description: "A considered everyday piece."
};

test("accepts a valid product payload", () => {
  assert.equal(validateProductInput(validProduct), null);
});

test("rejects missing or malformed required fields", () => {
  assert.match(validateProductInput({ ...validProduct, name: " " }), /Product name/);
  assert.match(validateProductInput({ ...validProduct, collection: 12 }), /Collection/);
  assert.match(validateProductInput({ ...validProduct, price: Infinity }), /price/);
  assert.match(validateProductInput({ ...validProduct, price: -1 }), /price/);
  assert.match(validateProductInput({ ...validProduct, currency: "GBP" }), /Currency/);
});

test("requires secure image URLs and rejects URL credentials", () => {
  assert.match(validateProductInput({ ...validProduct, image: "http://cdn.example.com/a.png" }), /HTTPS/);
  assert.match(validateProductInput({ ...validProduct, image: "javascript:alert(1)" }), /HTTPS/);
  assert.match(validateProductInput({ ...validProduct, image: "https://user:pass@cdn.example.com/a.png" }), /HTTPS/);
  assert.equal(validateProductInput({ ...validProduct, image: "" }), null);
});

test("bounds optional text fields and validates active status strictly", () => {
  assert.match(validateProductInput({ ...validProduct, category: "x".repeat(81) }), /Category/);
  assert.match(validateProductInput({ ...validProduct, description: "x".repeat(1001) }), /Description/);
  assert.match(validateProductInput({ ...validProduct, isActive: "false" }), /isActive/);
});

test("supports partial edits but rejects empty updates", () => {
  assert.equal(validateProductInput({ price: 0 }, { partial: true }), null);
  assert.equal(validateProductInput({ isActive: false }, { partial: true }), null);
  assert.match(validateProductInput({}, { partial: true }), /at least one/);
  assert.match(validateProductInput({ price: "" }, { partial: true }), /price/);
});


test("rejects missing or non-object product payloads safely", () => {
  assert.match(validateProductInput(null), /Product name/);
  assert.match(validateProductInput(undefined), /Product name/);
  assert.match(validateProductInput([], { partial: true }), /at least one/);
});

import { PacketDefinition } from "../../definitions";
import { Race, Class, Gender } from "./shared";
import { BinaryReader } from "../../BinaryReader";
import { ParsedValue, ParsedField } from "../../types";

// ============================================================
// Queries - Name, Time, and Information Requests
// ============================================================

// Custom parser for item query response optional data
function readItemQueryData(reader: BinaryReader): ParsedValue {
  // Check if there's item data (if not, item doesn't exist)
  if (reader.remaining === 0) {
    return { kind: "string", value: "Item not found" };
  }

  const fieldValues: Record<string, ParsedValue> = {};

  // Read all item fields
  fieldValues.class_and_sub_class = { kind: "number", value: reader.readU32() };
  fieldValues.name1 = { kind: "string", value: reader.readCString() };
  fieldValues.name2 = { kind: "string", value: reader.readCString() };
  fieldValues.name3 = { kind: "string", value: reader.readCString() };
  fieldValues.name4 = { kind: "string", value: reader.readCString() };
  fieldValues.display_id = { kind: "number", value: reader.readU32() };
  fieldValues.quality = { kind: "number", value: reader.readU32() };
  fieldValues.flags = { kind: "number", value: reader.readU32() };
  fieldValues.buy_price = { kind: "number", value: reader.readU32() };
  fieldValues.sell_price = { kind: "number", value: reader.readU32() };
  fieldValues.inventory_type = { kind: "number", value: reader.readU32() };
  fieldValues.allowed_class = { kind: "number", value: reader.readU32() };
  fieldValues.allowed_race = { kind: "number", value: reader.readU32() };
  fieldValues.item_level = { kind: "number", value: reader.readU32() };
  fieldValues.required_level = { kind: "number", value: reader.readU32() };
  fieldValues.required_skill = { kind: "number", value: reader.readU32() };
  fieldValues.required_skill_rank = { kind: "number", value: reader.readU32() };
  fieldValues.required_spell = { kind: "number", value: reader.readU32() };
  fieldValues.required_honor_rank = { kind: "number", value: reader.readU32() };
  fieldValues.required_city_rank = { kind: "number", value: reader.readU32() };
  fieldValues.required_faction = { kind: "number", value: reader.readU32() };
  fieldValues.required_faction_rank = { kind: "number", value: reader.readU32() };
  fieldValues.max_count = { kind: "number", value: reader.readU32() };
  fieldValues.stackable = { kind: "number", value: reader.readU32() };
  fieldValues.container_slots = { kind: "number", value: reader.readU32() };

  // Read stats[10]
  const stats: ParsedValue[] = [];
  for (let i = 0; i < 10; i++) {
    const statType = reader.readU32();
    const statValue = reader.readI32();
    stats.push({
      kind: "struct",
      fields: [
        {
          name: "stat_type",
          typeName: "u32",
          value: { kind: "number", value: statType },
          offset: 0,
          size: 4,
        },
        {
          name: "value",
          typeName: "i32",
          value: { kind: "number", value: statValue },
          offset: 0,
          size: 4,
        },
      ],
    });
  }
  fieldValues.stats = { kind: "array", items: stats, elementType: "Stat" };

  // Read damages[5]
  const damages: ParsedValue[] = [];
  for (let i = 0; i < 5; i++) {
    const damageMin = reader.readF32();
    const damageMax = reader.readF32();
    const school = reader.readU32();
    damages.push({
      kind: "struct",
      fields: [
        {
          name: "damage_minimum",
          typeName: "f32",
          value: { kind: "number", value: damageMin },
          offset: 0,
          size: 4,
        },
        {
          name: "damage_maximum",
          typeName: "f32",
          value: { kind: "number", value: damageMax },
          offset: 0,
          size: 4,
        },
        {
          name: "school",
          typeName: "u32",
          value: { kind: "number", value: school },
          offset: 0,
          size: 4,
        },
      ],
    });
  }
  fieldValues.damages = { kind: "array", items: damages, elementType: "Damage" };

  // Read resistances
  fieldValues.armor = { kind: "number", value: reader.readI32() };
  fieldValues.holy_resistance = { kind: "number", value: reader.readI32() };
  fieldValues.fire_resistance = { kind: "number", value: reader.readI32() };
  fieldValues.nature_resistance = { kind: "number", value: reader.readI32() };
  fieldValues.frost_resistance = { kind: "number", value: reader.readI32() };
  fieldValues.shadow_resistance = { kind: "number", value: reader.readI32() };
  fieldValues.arcane_resistance = { kind: "number", value: reader.readI32() };

  fieldValues.delay = { kind: "number", value: reader.readU32() };
  fieldValues.ammo_type = { kind: "number", value: reader.readU32() };
  fieldValues.ranged_range_modification = { kind: "number", value: reader.readF32() };

  // Read spells[5]
  const spells: ParsedValue[] = [];
  for (let i = 0; i < 5; i++) {
    const spell = reader.readU32();
    const spellTrigger = reader.readU32();
    const spellCharges = reader.readI32();
    const spellCooldown = reader.readI32();
    const spellCategory = reader.readU32();
    const spellCategoryCooldown = reader.readI32();
    spells.push({
      kind: "struct",
      fields: [
        {
          name: "spell",
          typeName: "u32",
          value: { kind: "number", value: spell },
          offset: 0,
          size: 4,
        },
        {
          name: "spell_trigger",
          typeName: "u32",
          value: { kind: "number", value: spellTrigger },
          offset: 0,
          size: 4,
        },
        {
          name: "spell_charges",
          typeName: "i32",
          value: { kind: "number", value: spellCharges },
          offset: 0,
          size: 4,
        },
        {
          name: "spell_cooldown",
          typeName: "i32",
          value: { kind: "number", value: spellCooldown },
          offset: 0,
          size: 4,
        },
        {
          name: "spell_category",
          typeName: "u32",
          value: { kind: "number", value: spellCategory },
          offset: 0,
          size: 4,
        },
        {
          name: "spell_category_cooldown",
          typeName: "i32",
          value: { kind: "number", value: spellCategoryCooldown },
          offset: 0,
          size: 4,
        },
      ],
    });
  }
  fieldValues.spells = { kind: "array", items: spells, elementType: "Spell" };

  fieldValues.bonding = { kind: "number", value: reader.readU32() };
  fieldValues.description = { kind: "string", value: reader.readCString() };
  fieldValues.page_text = { kind: "number", value: reader.readU32() };
  fieldValues.language = { kind: "number", value: reader.readU32() };
  fieldValues.page_text_material = { kind: "number", value: reader.readU32() };
  fieldValues.start_quest = { kind: "number", value: reader.readU32() };
  fieldValues.lock_id = { kind: "number", value: reader.readU32() };
  fieldValues.material = { kind: "number", value: reader.readU32() };
  fieldValues.sheathe_type = { kind: "number", value: reader.readU32() };
  fieldValues.random_property = { kind: "number", value: reader.readU32() };
  fieldValues.block = { kind: "number", value: reader.readU32() };
  fieldValues.item_set = { kind: "number", value: reader.readU32() };
  fieldValues.max_durability = { kind: "number", value: reader.readU32() };
  fieldValues.area = { kind: "number", value: reader.readU32() };
  fieldValues.map = { kind: "number", value: reader.readU32() };
  fieldValues.bag_family = { kind: "number", value: reader.readU32() };

  // Convert fieldValues Record to ParsedField array
  const fields: ParsedField[] = Object.entries(fieldValues).map(
    ([name, value]) => ({
      name,
      typeName: "ItemField",
      value,
      offset: 0,
      size: 0,
    })
  );

  return { kind: "struct", fields };
}

export const queriesDefinitions: PacketDefinition[] = [
  // CMSG_NAME_QUERY (0x0050) - Request information about a player by GUID
  {
    opcode: 0x0050,
    name: "CMSG_NAME_QUERY",
    direction: "CMSG",
    fields: [{ kind: "primitive", name: "guid", type: "Guid" }],
  },

  // SMSG_NAME_QUERY_RESPONSE (0x0051) - Response with player information
  {
    opcode: 0x0051,
    name: "SMSG_NAME_QUERY_RESPONSE",
    direction: "SMSG",
    fields: [
      { kind: "primitive", name: "guid", type: "Guid" },
      { kind: "primitive", name: "character_name", type: "CString" },
      { kind: "primitive", name: "realm_name", type: "CString" },
      { kind: "enum", name: "race", enumDef: Race },
      { kind: "enum", name: "gender", enumDef: Gender },
      { kind: "enum", name: "class", enumDef: Class },
    ],
  },

  // CMSG_QUERY_TIME (0x01CE) - Request server time
  {
    opcode: 0x01ce,
    name: "CMSG_QUERY_TIME",
    direction: "CMSG",
    fields: [],
  },

  // SMSG_QUERY_TIME_RESPONSE (0x01CF) - Response with server time
  {
    opcode: 0x01cf,
    name: "SMSG_QUERY_TIME_RESPONSE",
    direction: "SMSG",
    fields: [{ kind: "primitive", name: "timestamp", type: "u32" }],
  },

  // CMSG_QUESTGIVER_STATUS_QUERY (0x0182) - Query quest giver status
  {
    opcode: 0x0182,
    name: "CMSG_QUESTGIVER_STATUS_QUERY",
    direction: "CMSG",
    fields: [{ kind: "primitive", name: "guid", type: "Guid" }],
  },

  // SMSG_QUESTGIVER_STATUS (0x0183) - Quest giver status response
  {
    opcode: 0x0183,
    name: "SMSG_QUESTGIVER_STATUS",
    direction: "SMSG",
    fields: [
      { kind: "primitive", name: "guid", type: "Guid" },
      { kind: "primitive", name: "status", type: "u32" },
    ],
  },

  // CMSG_ITEM_QUERY_SINGLE (0x0056) - Client requests item information
  {
    opcode: 0x0056,
    name: "CMSG_ITEM_QUERY_SINGLE",
    direction: "CMSG",
    fields: [
      { kind: "primitive", name: "item", type: "u32" },
      { kind: "primitive", name: "guid", type: "Guid" },
    ],
  },

  // SMSG_ITEM_QUERY_SINGLE_RESPONSE (0x0058) - Item information response
  {
    opcode: 0x0058,
    name: "SMSG_ITEM_QUERY_SINGLE_RESPONSE",
    direction: "SMSG",
    fields: [
      { kind: "primitive", name: "item", type: "u32" },
      {
        kind: "custom",
        name: "item_data",
        typeName: "ItemQueryData",
        read: readItemQueryData,
      },
    ],
  },
];

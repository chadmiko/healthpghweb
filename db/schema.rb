# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141109055341) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "company_brands", force: true do |t|
    t.string   "name",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cost_sharing", force: true do |t|
    t.integer "health_plan_id"
    t.integer "level",                         null: false
    t.string  "medical_deductible_individual"
    t.string  "medical_deductible_family"
    t.string  "drug_deductible_individual"
    t.string  "drug_deductible_family"
    t.string  "medical_max_oop_individual"
    t.string  "medical_max_oop_family"
    t.string  "drug_max_oop_individual"
    t.string  "drug_max_oop_family"
    t.string  "pcp_copay"
    t.string  "specialist_copay"
    t.string  "er_copay"
    t.string  "inpatient_facility"
    t.string  "inpatient_physician"
    t.string  "generic_drugs"
    t.string  "pfd_brand_drugs"
    t.string  "non_pfd_brand_drugs"
    t.string  "specialty_drugs"
  end

  add_index "cost_sharing", ["health_plan_id"], name: "index_cost_sharing_on_health_plan_id", using: :btree

  create_table "counties", force: true do |t|
    t.string  "name",                                 null: false
    t.string  "fips_code",  limit: 5,                 null: false
    t.string  "state_abbr", limit: 2,                 null: false
    t.boolean "active",               default: false, null: false
  end

  add_index "counties", ["active"], name: "index_counties_on_active", using: :btree
  add_index "counties", ["fips_code"], name: "index_counties_on_fips_code", unique: true, using: :btree
  add_index "counties", ["name", "state_abbr"], name: "index_counties_on_name_and_state_abbr", unique: true, using: :btree

  create_table "county_health_plans", force: true do |t|
    t.integer  "county_id"
    t.integer  "health_plan_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "county_health_plans", ["county_id", "health_plan_id"], name: "index_county_health_plans_on_county_id_and_health_plan_id", unique: true, using: :btree
  add_index "county_health_plans", ["county_id"], name: "index_county_health_plans_on_county_id", using: :btree
  add_index "county_health_plans", ["health_plan_id"], name: "index_county_health_plans_on_health_plan_id", using: :btree

  create_table "health_plans", force: true do |t|
    t.integer  "issuer_id",                                       null: false
    t.string   "hios_id",                                         null: false
    t.string   "marketing_name",                                  null: false
    t.integer  "metal_level",                                     null: false
    t.string   "network_type",                                    null: false
    t.integer  "plan_year",                                       null: false
    t.text     "network_url"
    t.text     "summary_of_benefits_url"
    t.text     "formulary_url"
    t.text     "plan_brochure_url"
    t.boolean  "adult_dental"
    t.boolean  "child_dental"
    t.decimal  "premium_age_21",          precision: 7, scale: 2
    t.decimal  "premium_age_27",          precision: 7, scale: 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "health_plans", ["hios_id", "plan_year"], name: "index_health_plans_on_hios_id_and_plan_year", unique: true, using: :btree
  add_index "health_plans", ["hios_id"], name: "index_health_plans_on_hios_id", using: :btree
  add_index "health_plans", ["issuer_id"], name: "index_health_plans_on_issuer_id", using: :btree

  create_table "issuers", force: true do |t|
    t.integer  "brand_id"
    t.string   "name",                 null: false
    t.string   "state_abbr", limit: 2, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "issuers", ["brand_id"], name: "index_issuers_on_brand_id", using: :btree
  add_index "issuers", ["name", "state_abbr"], name: "index_issuers_on_name_and_state_abbr", unique: true, using: :btree

  create_table "rating_areas", force: true do |t|
    t.string   "name"
    t.string   "state_abbr"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end

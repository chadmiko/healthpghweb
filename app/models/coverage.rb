class Coverage

  def initialize( available_plans )
    @plans = available_plans
  end

  def self.find_plans_by_county(fips, year)
    cty = County.where(fips_code: fips).first
    cty.health_plans.where(plan_year: year).to_a
  end

  def self.next_effective_date(tz='Eastern Time (US & Canada)')
    now = DateTime.now.utc
    local_now = now.in_time_zone(tz)
    local_now.day > 15 ? local_now.advance(months: 1).beginning_of_month : local_now.end_of_month 
  end
 
  class Applicant

    attr_reader :family_size, :income, :monthly_premium_cap, :income_ratio

    def initialize( income, family_size )
      @family_size, @income = family_size, income
      @monthly_premium_cap = nil
      @income_ratio = nil
      set_premium_cap
    end

    def get_subsidy( plan, list_price )
      return 0 if ("Catastrophic" == plan.metal_level_name) 
      return 0 if ( income_is_too_low? || income_is_too_high? )

      return nil if (income.nil? || monthly_premium_cap.nil?) 
      subsidy = list_price - monthly_premium_cap;
      return _.max([subsidy, 0])
    end

    # Checks if below 100% FPL
    def income_too_low?
      !income_ratio.nil? && income_ratio < 1
    end

    # checks if above 400% FPL
    def income_too_high?
      !income_ratio.nil? && income_ratio > 4
    end

    def set_premium_cap
      return nil if !family_size || !income 

      n = nil

      case family_size
        when 1
          n = 11490.0
        when 2
          n = 15510.0
        when 3
          n = 19530.0
        when 4
          n = 23550.0
        else
          n = 23550.0 + 4020.0 * (family_size - 4)
        end

        @income_ratio = income / n
        @monthly_premium_cap = PremiumCapCalculator.run( income_ratio, income ) 
    end
  end

  class InsurancePlan
    attr_reader :record

    def initialize( record )
      @record = record
      # @subsidy, @premium, @net_premium = a, b, c 
    end

    def get_premium( age, tobacco )
      PlanPremiumCalculator.calculate( record.benchmark_monthly_premium, age, tobacco )
    end
  end

  class PlanPremiumCalculator
    
    def self.calculate( benchmark_premium, age, tobacco )
      curve = AgeCurves::FEDERAL
      ratio_applicant = curve[age.to_s]
      ratio_27 = curve["27"]
      amount = ratio_applicant / ratio_27 * benchmark_premium
      amount.to_f
    end 
  end

  class BenchmarkCostCalculator
    
    def initialize( silver_plans )
      @plans = silver_plans
    end

    def run
      
    end
  end

  class PremiumCapCalculator
    attr_reader :ratio, :income

    def self.run( income_ratio, income)
      PremiumCapCalculator.new( income_ratio, income ).run
    end

    def initialize( income_ratio, income )
      raise ArgumentError.new if (income_ratio.blank? || income.blank?)
      @income, @ratio = income, income_ratio
      self
    end

    def run
      i = 1
      ratio >= 0 && ratio <= 1.33 ? i = 0.02 : \
        ratio > 1.33 && ratio <= 1.5 ? i = 0.05882352941176474 * (ratio - 1.33) + 0.03 : \
          ratio > 1.5 && ratio <= 2 ? i = 0.046 * (ratio - 1.5) + 0.04 : \
            ratio > 2 && ratio <= 2.5 ? i = 0.035 * (ratio - 2) + 0.063 : \
              ratio > 2.5 && ratio <= 3 ? i = (0.095 - 0.0805) / 0.5 * (ratio - 2.5) + 0.0805 : \
                ratio > 3 && ratio <= 4 && (i = 0.095)

      (i * income) / 12.0
    end
  end

  class AgeCurves

    FEDERAL = {
        '20' => 0.635,
        '21' => 1.0,
        '22' => 1.0,
        '23' => 1.0,
        '24' => 1.0,
        '25' => 1.004,
        '26' => 1.024,
        '27' => 1.048,
        '28' => 1.087,
        '29' => 1.119,
        '30' => 1.135,
        '31' => 1.159,
        '32' => 1.183,
        '33' => 1.198,
        '34' => 1.214,
        '35' => 1.222,
        '36' => 1.23,
        '37' => 1.238,
        '38' => 1.246,
        '39' => 1.262,
        '40' => 1.278,
        '41' => 1.302,
        '42' => 1.325,
        '43' => 1.357,
        '44' => 1.397,
        '45' => 1.444,
        '46' => 1.5,
        '47' => 1.563,
        '48' => 1.635,
        '49' => 1.706,
        '50' => 1.786,
        '51' => 1.865,
        '52' => 1.952,
        '53' => 2.04,
        '54' => 2.135,
        '55' => 2.23,
        '56' => 2.333,
        '57' => 2.437,
        '58' => 2.548,
        '59' => 2.603,
        '60' => 2.714,
        '61' => 2.81,
        '62' => 2.873,
        '63' => 2.952,
        '64' => 3.0
    }
  end
end

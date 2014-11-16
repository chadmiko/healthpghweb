require 'rails_helper'

describe Coverage do

  context 'Applicant' do
    let(:klass) { Coverage::Applicant }

    describe 'set_premium_cap' do
      it 'does not calculate a premium cap when missing income or family size' do
        subject = klass.new('foo', nil)
        expect( subject.monthly_premium_cap ).to be_blank
        subject = klass.new(nil, 'foo')
        expect( subject.monthly_premium_cap ).to be_blank
      end

    end
  end

  # Testing with real 2014 HM West Cty PPO Blue 500 Platinum
  context 'InsurancePlan' do
    let(:plan) { FactoryGirl.create(:silver_health_plan, premium_adult_individual_27: 283.96) }
    let(:subject) { Coverage::InsurancePlan.new( plan ) }

    it 'calculates the correct rounded premium for a 27 yr old' do
      expect( subject.get_premium( 27, false).round ).to eq( 284)     
    end

    it 'calculates the correct rounded premium for a 64 yr old' do
      expect( subject.get_premium( 64, false).round ).to eq( 813)     
    end

    it 'calculates the correcto rounded premium for a 20 yr old' do
      expect( subject.get_premium( 20, false).round ).to eq( 172)     
    end
  end

  context 'PremiumCapCalculator' do
    let(:subject) { Coverage::PremiumCapCalculator }

    it 'requires an income and income ratio' do
      expect{ Coverage::PremiumCapCalculator.new('ratio', nil) }.to raise_error(ArgumentError)
      expect{ Coverage::PremiumCapCalculator.new(nil, 'income') }.to raise_error(ArgumentError)
    end

    it 'calculates the correct ratio' do
      expect(subject.run( 1.1, 12000 ) == 20 ).to eq(true)  # 1 to 1.33     
      expect(subject.run( 2.088, 24000 ) == 132.16 ).to eq(true)  # 2 to 2.5     
      expect(subject.run( 3.5, 40215 ).to_i == 318 ).to eq(true)  # 2 to 2.5     
    end
  end
end 

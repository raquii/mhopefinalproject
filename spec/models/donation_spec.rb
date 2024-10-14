require 'rails_helper'

RSpec.describe Donation, type: :model do
  let(:user) { create(:user) }
  let (:donation) { create(:donation, user: user) }


  it "is valid with valid attributes" do
    expect(donation).to be_valid
  end

  it "is not valid without an amount" do
    donation = build(:donation, user: user, amount: nil)
    expect(donation).to_not be_valid
  end

  it "is not valid without a payment_status" do
    donation = build(:donation, user: user, payment_status: nil)
    expect(donation).to_not be_valid
  end

  it "is not valid without a valid amount" do
    donation = build(:donation, user: user, amount: 0)
    expect(donation).to_not be_valid
  end

  it { should belong_to (:user) }
end
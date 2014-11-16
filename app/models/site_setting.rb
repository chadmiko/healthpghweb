class SiteSetting
  #let the view handle formatting
  SITES = { 'healthpgh.com' => { 
              'phone' => '8008001999', 'email' => 'service@healthpgh.com'
            }
          }

  class << self
    def customer_service_phone
      SITES['healthpgh.com']['phone']
    end

    def customer_service_email
      SITES['healthpgh.com']['email']
    end
  end
end

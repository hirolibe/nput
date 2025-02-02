module DummyData
  module Duration
    class << self
      def daily_durations
        7.times.map do |i|
          {
            duration: rand(3600..28800), # 1時間～8時間
            created_at: (Time.current - i.days).beginning_of_day,
          }
        end
      end

      def weekly_durations
        6.times.map do |i|
          {
            duration: rand(25200..201600), # 7時間～56時間
            created_at: (Time.current - (i + 1).weeks).beginning_of_week,
          }
        end
      end

      def monthly_durations
        4.times.map do |i|
          {
            duration: rand(108000..864000), # 30時間～240時間
            created_at: (Time.current - (i + 3).months).beginning_of_month,
          }
        end
      end
    end
  end
end

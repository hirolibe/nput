module AttachableImages
  extend ActiveSupport::Concern

  private

    def attach_images(record, signed_ids)
      return if signed_ids.blank?

      signed_ids.each do |signed_id|
        record.images.attach(signed_id)
      end
    end
end

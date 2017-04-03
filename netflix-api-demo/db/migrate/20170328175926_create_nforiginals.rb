class CreateNforiginals < ActiveRecord::Migration[5.0]
  def change
    create_table :nforiginals do |t|
      t.string :title
      t.string :year
      t.string :rating
      t.string :genre

      t.timestamps
    end
  end
end

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const myCustomLabels = {
  totalDocs: 'itemCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
};
mongoosePaginate.paginate.options = { customLabels: myCustomLabels };
const Schema = mongoose.Schema;
const schema = new Schema(
  {

    liter: { type: String, trim: true },

    used_in: { type: String },

    gaushala_id: { type: String },

    distribution_person: { type: String },

    date: { type: String },

    description: { type: String },

    isDeleted: { type: Boolean },

    isActive: { type: Boolean },

    createdAt: { type: Date },

    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  }
  , { timestamps: { createdAt: 'createdAt', } }
);
schema.pre('save', async function (next) {
  this.isDeleted = false;
  this.isActive = true;
  next();
});

schema.pre('insertMany', async function (next, docs) {
  if (docs && docs.length) {
    for (let index = 0; index < docs.length; index++) {
      const element = docs[index];
      element.isDeleted = false;
      element.isActive = true;
    }
  }
  next();
});

schema.method('toJSON', function () {
  const {
    _id, __v, ...object
  } = this.toObject({ virtuals: true });
  object.id = _id;

  return object;
});
schema.plugin(mongoosePaginate);
schema.plugin(idValidator);
const milk_usage = mongoose.model('milk_usage', schema);
module.exports = milk_usage;
module.exports = function(doc) {
  if (doc &&
      doc.type === 'data_record' &&
      doc.fields &&
      doc.fields.child_name) {
    emit();
  }
}

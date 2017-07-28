module.exports = function() {
  if (this.fields.child_name) {
    this.fields.patient_name = this.fields.child_name;
    delete this.fields.child_name;
  }
}

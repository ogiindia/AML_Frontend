class VariableType {
  constructor(value) {
    this.value = value;
  }

  toJSON() {
    return `$${this.value}`;
  }
}

export { VariableType };

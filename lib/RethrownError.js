// code by Matt; taken from https://stackoverflow.com/a/42755876
// Standard error extender from @deployable/errors
class ExtendedError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
    Sentry.captureException(message);
  }
}

class RethrownError extends ExtendedError {
  constructor(message, error) {
    super(message);
    if (!error) throw new Error('RethrownError requires a message and error');
    this.original = error;
    this.new_stack = this.stack;
    const messageLines = (this.message.match(/\n/g) || []).length + 1;
    this.stack = `${this.stack
      .split('\n')
      .slice(0, messageLines + 1)
      .join('\n')}\n${error.stack}`;
    Sentry.captureException(message);
  }
}

module.exports = RethrownError;

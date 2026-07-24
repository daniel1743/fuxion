export class Slice1Error extends Error {
  constructor(code, message, { recoverable = false, context = {}, cause } = {}) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.code = code;
    this.recoverable = recoverable;
    this.context = context;
  }
}

export class InvalidSourceError extends Slice1Error {}
export class UnsupportedSourceSchemaError extends Slice1Error {}
export class SnapshotWriteError extends Slice1Error {}
export class SnapshotIntegrityError extends Slice1Error {}
export class SchemaValidationError extends Slice1Error {}
export class NormalizationError extends Slice1Error {}
export class ArtifactWriteError extends Slice1Error {}
export class RestoreIntegrityError extends Slice1Error {}
export class UnsafePathError extends Slice1Error {}
export class NetworkAccessAttemptError extends Slice1Error {}

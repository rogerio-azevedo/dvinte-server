export class Asset {
  constructor(
    public readonly id: number,
    public readonly url: string,
    public readonly originalName: string,
    public readonly uploadedAt: Date
  ) {}
}

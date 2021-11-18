import { Coordinate } from "src/domain/entities/coordinate";

export abstract class GeolocationRepository {
    abstract getInstantPosition(): Promise<Coordinate>;
}
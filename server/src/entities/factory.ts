import { UserRepository } from './user/repository';
import { TripRepository } from './trip/repository';
import { SubscriptionRepository } from './subscription/repository';
import { OccurrenceRepository } from './occurrence/repository';
import { ShapeRepository } from './shape/repository';
import { FakeSensorRepository } from './sensor/repository';
import { RouteRepository } from './route/repository';
import { NeighborhoodRepository } from './neighborhood/repository';
import { MessagesRepository } from './messages/repository';
import { AffectRepository } from './affect/repository';
import { AdminRepository } from './admin/repository';

export const repositories = {
  user: new UserRepository(),
  trip: new TripRepository(),
  subscription: new SubscriptionRepository(),
  occurrence: new OccurrenceRepository(),
  shape: new ShapeRepository(),
  sensor: new FakeSensorRepository(),
  route: new RouteRepository(),
  neighborhood: new NeighborhoodRepository(),
  messages: new MessagesRepository(),
  affect: new AffectRepository(),
  admin: new AdminRepository(),
};

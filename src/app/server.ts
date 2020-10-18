import App from './app';
import appConfig from './config/application';
import {Container} from "typescript-ioc";
import {MongoDbServiceProvider} from "../common/Provider/MongoDbServiceProvider";
import {ImageController} from '../Image/Controller/ImageController';

const app = new App();

const controllers = [
    Container.get(ImageController)
];

const serviceProvider = [
    Container.get(MongoDbServiceProvider)
];

app.preInitializeMiddlewares();
app.initializeControllers(controllers);
app.postInitializeMiddlewares();
app.initializeServiceProvider(serviceProvider).then(() => {
    app.listen(appConfig.port, appConfig.hostname);
});
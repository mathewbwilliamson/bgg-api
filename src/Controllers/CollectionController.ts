/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Body, JsonController, Post } from 'routing-controllers';
import { loadItemsFromCollectionIntoDb } from '../Services/CollectionService';

@JsonController()
export class CollectionController {
    @Post('/api/collection')
    async getCollection(@Body() usernameBody: { username: string }) {
        return await loadItemsFromCollectionIntoDb(usernameBody.username);
    }
}

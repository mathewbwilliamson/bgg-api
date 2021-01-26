import { Body, JsonController, Post } from 'routing-controllers';
import { getCollection } from '../Services/CollectionService';

@JsonController()
export class CollectionController {
    @Post('/api/collection')
    async getCollection(@Body() usernameBody: { username: string }) {
        return await getCollection(usernameBody.username);
    }
}

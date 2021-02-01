import { BoardGameItemEntity, NewBoardGameItemModel } from '../Models/BoardGameItem.entity';
import { Repository, getRepository } from 'typeorm';

export class CollectionRepo {
    upsertBoardGameItem = async (newItem: NewBoardGameItemModel) => {
        const boardGameItemRepo: Repository<BoardGameItemEntity> = getRepository(BoardGameItemEntity);
        const foundItem = await boardGameItemRepo.findOne({ objectId: newItem.objectId });

        if (!foundItem) {
            // Create our new BoardGame.
            const boardgameItem: BoardGameItemEntity = boardGameItemRepo.create(newItem);

            // Persist it to the database.
            await boardGameItemRepo.save(boardgameItem);
        } else {
            newItem.createdAt = foundItem.createdAt;

            const updatedBoardGameItem = await boardGameItemRepo.merge(foundItem, newItem);
            await boardGameItemRepo.save(updatedBoardGameItem);
        }
    };
}

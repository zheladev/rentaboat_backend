import { getRepository, Repository } from "typeorm";
import CreateChatDTO from "../dtos/createChat";
import PostMessageDTO from "../dtos/PostMessage";
import Chat from "../entities/chat";
import Message from "../entities/message";
import User from "../entities/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import BaseService from "./baseService";


class ChatService extends BaseService<Chat> {
    private messageRepository: Repository<Message> = getRepository(Message);
    private userRepository: Repository<User> = getRepository(User);

    constructor() {
        super(Chat)
    };

    public async create(chatData: CreateChatDTO, user: User): Promise<Chat> {
        const receiver = await this.userRepository.findOne(chatData.receiverId);

        if (!receiver) {
            throw new EntityNotFoundException<User>();
        }

        const createdChat = await this.repository.create({
            receiver: receiver,
            creator: user,
        })
        await this.repository.save(createdChat);

        return await this.repository.findOne(createdChat.id, {relations: ["creator", "receiver"]});
    }

    public async getMessagesById(chatId: string): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: {
                chat: chatId
            }
        });

        return messages;
    }

    public async postMessage(chatId: string, message: PostMessageDTO, user: User): Promise<Message> {
        const chat = await this.repository.findOne(chatId, { relations: ["creator", "receiver"]});

        if (user.id !== chat.creator.id || user.id !== chat.receiver.id) {
            throw new ForbiddenActionException("Send message.");
        }

        const createdMessage = await this.messageRepository.create({
            ...message,
            chat: chat,
            user: user
        })
        await this.messageRepository.save(createdMessage);

        return await this.messageRepository.findOne(createdMessage.id);
    }
}

export default ChatService;
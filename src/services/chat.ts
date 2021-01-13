import { getRepository, Repository } from "typeorm";
import CreateChatDTO from "../dtos/createChat";
import PostMessageDTO from "../dtos/postMessage";
import Chat from "../entities/chat";
import Message from "../entities/message";
import User from "../entities/user";
import EntityNotFoundException from "../exceptions/EntityNotFoundException";
import ForbiddenActionException from "../exceptions/ForbiddenActionException";
import BaseService from "./baseService";


/**
 * Chat service
 *
 * @class ChatService
 * @extends {BaseService<Chat>}
 */
class ChatService extends BaseService<Chat> {
    private messageRepository: Repository<Message> = getRepository(Message);
    private userRepository: Repository<User> = getRepository(User);

    constructor() {
        super(Chat)
    };

    /**
     * Creates Chat with given data
     *
     * @param {CreateChatDTO} chatData
     * @param {User} user
     * @return {*}  {Promise<Chat>}
     * @memberof ChatService
     */
    public async create(chatData: CreateChatDTO, user: User): Promise<Chat> {
        const receiver = await this.userRepository.findOne(chatData.receiverId);

        if (!receiver) {
            throw new EntityNotFoundException<User>(User);
        }

        const createdChat = await this.repository.create({
            receiver: receiver,
            creator: user,
        })
        await this.repository.save(createdChat);

        return await this.repository.findOne(createdChat.id, {relations: ["creator", "receiver"]});
    }

    /**
     * Returns array of messages belonging to matched Chat
     *
     * @param {string} chatId
     * @return {*}  {Promise<Message[]>}
     * @memberof ChatService
     */
    public async getMessagesById(chatId: string): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            where: {
                chat: chatId
            }
        });

        return messages;
    }

    /**
     * Posts message as given User on matched Chat
     *
     * @param {string} chatId
     * @param {PostMessageDTO} message
     * @param {User} user
     * @return {*}  {Promise<Message>}
     * @memberof ChatService
     */
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
import { Router, Request, Response, RouterType } from 'express';
import Chat from '../models/Chat';
import { authenticateToken } from '../middleware/auth';

const router: RouterType = Router();

// Get or create chat for a product
router.post('/product/:productId', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId } = req.params;
    const { sellerId } = req.body;

    console.log('Chat creation request:', {
      productId,
      sellerId,
      user: req.user,
      body: req.body
    });

    if (!sellerId) {
      return res.status(400).json({ message: 'Seller ID is required' });
    }

    // Normalize user IDs - handle both string and object formats
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found' });
    }

    // Ensure we don't create a chat with ourselves
    if (sellerId.toString() === userId.toString()) {
      return res.status(400).json({ message: 'Cannot create a chat with yourself' });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      product: productId,
      $or: [
        { buyer: userId, seller: sellerId },
        { buyer: sellerId, seller: userId }
      ]
    })
      .populate('buyer', 'name email profile_picture')
      .populate('seller', 'name email profile_picture')
      .populate('product', 'name price images')
      .populate('messages.sender', 'name email profile_picture');

    console.log('Existing chat found:', chat);

    // If no chat exists, create a new one
    if (!chat) {
      console.log('Creating new chat with:', {
        buyer: userId,
        seller: sellerId,
        product: productId
      });

      chat = await Chat.create({
        buyer: userId,
        seller: sellerId,
        product: productId,
        messages: []
      });
      
      chat = await Chat.findById(chat._id)
        .populate('buyer', 'name email profile_picture')
        .populate('seller', 'name email profile_picture')
        .populate('product', 'name price images')
        .populate('messages.sender', 'name email profile_picture');
        
      console.log('New chat created:', chat);
    }

    res.json(chat);
  } catch (error) {
    console.error('Error creating/fetching chat:', error);
    res.status(500).json({ 
      message: 'Error creating/fetching chat',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user's chats
router.get('/user', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const chats = await Chat.find({
      $or: [
        { buyer: req.user.id },
        { seller: req.user.id }
      ]
    })
      .populate('buyer', 'name email profilePicture')
      .populate('seller', 'name email profilePicture')
      .populate('product', 'title price images')
      .populate('messages.sender', 'name email profilePicture')
      .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// Send message
router.post('/:chatId/message', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { content } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      {
        $push: {
          messages: {
            sender: req.user.id,
            content,
            timestamp: new Date()
          }
        },
        lastMessage: new Date()
      },
      { new: true }
    )
      .populate('buyer', 'name email profilePicture')
      .populate('seller', 'name email profilePicture')
      .populate('product', 'title price images')
      .populate('messages.sender', 'name email profilePicture');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router; 
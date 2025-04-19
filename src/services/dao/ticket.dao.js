import TicketModel from '../../services/models/ticket.model.js';
import { v4 as uuidv4 } from 'uuid';

class TicketDAO {
  static async createTicket({ amount, purchaser }) {
    const newTicket = await TicketModel.create({
      code: uuidv4(),
      amount,
      purchaser
    });
    return newTicket;
  }
}

export default TicketDAO;

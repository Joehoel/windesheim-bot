import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../../middleware/mongo";
import User from "../../../models/user.model";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  const user = await User.findOne({
    id,
  });

  if (user) {
    return res.status(200).json(user);
  }

  return res.status(500).json({ message: `No user found with the id: '${id}'` });
};

export default connect(handler);

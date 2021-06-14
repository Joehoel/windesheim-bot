import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../middleware/mongo";
import User from "../../models/User";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.params.id as string;

  const { nickname } = await User.findOne({
    id,
  });

  if (nickname) {
    return res.status(200).json({ nickname });
  }

  return res.status(500).json({ message: `No user found with the id: '${id}'` });
};

export default connect(handler);

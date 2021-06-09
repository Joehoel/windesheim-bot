import { NextApiRequest, NextApiResponse } from "next";
import connect from "../../middleware/mongo";
import User from "../../models/User";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, firstname, lastname, opleiding, verified } = req.body;

    console.log(req.body);
    const studentnummer = email.split("@")[0];
    const nickname = `${firstname} ${lastname} (${studentnummer})`;

    const user = await User.findOneAndUpdate(
      {
        email,
      },
      {
        email,
        opleiding,
        studentnummer,
        nickname,
        firstname,
        lastname,
        verified,
      },
      {
        upsert: true,
      }
    );
    console.log(user);
    return res.status(200).json(user);
  } else if (req.method === "PATCH") {
    const { email, verified } = req.body;

    const user = await User.updateOne(
      {
        email,
      },
      {
        verified,
      }
    );
    console.log(user);
    return res.status(200).json(user);
  }
};

export default connect(handler);

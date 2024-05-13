import { useSession } from 'next-auth/react';

const accountsApiRoute = 'https://accounts-api.dev.dash.net.br/v1';

export const POST = async (req: any, res: any) => {
  const { data: session } = useSession();

  const ctoken = await fetch(accountsApiRoute + '/onboard/steam', {
    method: 'POST',
    body: JSON.stringify({
      v_hash: req.body.v_hash,
      steam: {
        id: req.body.steam_id,
      },
    }),
  });

  if (!ctoken.ok) {
    return res.status(ctoken.status).json(await ctoken.json());
  }

  const { user_id: uid, resource_owner: rid } = await ctoken.json().then((data) => {
    return res.json(data);
  })


  res.json({ uid, rid });
}

export default POST
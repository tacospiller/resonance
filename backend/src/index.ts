import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to resonance Backend API' });
});

app.get('/schemas', (req: Request, res: Response) => {
  res.json({
    version: "1.0.0",
    schemas: [
      {
        id: "cards",
        name: "카드",
        icon: "pi pi-image"
      },
      {
        id: "characters",
        name: "캐릭터",
        icon: "pi pi-user"
      }
    ]
   });
});

app.get('/schema/:schemaId', (req: Request, res: Response) => {
  const { schemaId } = req.params;

  // 스키마별 컬럼 정의
  const schemaDefinitions: Record<string, any> = {
    'cards': {
      id: schemaId,
      name: '카드',
      columns: [
        { field: 'id', header: 'ID', sortable: true, editable: false, type: 'number' },
        { field: 'name', header: '카드명', sortable: true, editable: true, type: 'text' },
        { field: 'rarity', header: '등급', sortable: true, editable: true, type: 'text' },
        { field: 'attack', header: '공격력', sortable: true, editable: true, type: 'number' },
        { field: 'defense', header: '방어력', sortable: true, editable: true, type: 'number' },
        { field: 'description', header: '설명', sortable: false, editable: true, type: 'text' }
      ],
      data: [
        { id: 1, name: '화염의 검', rarity: 'Epic', attack: 150, defense: 50, description: '불꽃을 일으키는 강력한 검' },
        { id: 2, name: '얼음 방패', rarity: 'Rare', attack: 30, defense: 200, description: '얼음으로 만들어진 방패' }
      ]
    },
    'characters': {
      id: schemaId,
      name: '캐릭터',
      columns: [
        { field: 'id', header: 'ID', sortable: true, editable: false, type: 'number' },
        { field: 'name', header: '캐릭터명', sortable: true, editable: true, type: 'text' },
        { field: 'class', header: '직업', sortable: true, editable: true, type: 'text' },
        { field: 'level', header: '레벨', sortable: true, editable: true, type: 'number' },
        { field: 'hp', header: 'HP', sortable: true, editable: true, type: 'number' },
        { field: 'mp', header: 'MP', sortable: true, editable: true, type: 'number' }
      ],
      data: [
        { id: 1, name: '전사', class: 'Warrior', level: 50, hp: 1000, mp: 200 },
        { id: 2, name: '마법사', class: 'Mage', level: 45, hp: 500, mp: 800 }
      ]
    }
  };

  const schemaData = schemaDefinitions[schemaId];

  if (!schemaData) {
    return res.status(404).json({ error: '스키마를 찾을 수 없습니다.' });
  }

  res.json(schemaData);
});

app.post('/data/:schemaId', (req: Request, res: Response) => {
  const { schemaId } = req.params;

  res.json({
    version: 1
  });
})

app.listen(port, () => {
  console.log(`⚡️ Server is running at http://localhost:${port}`);
});

FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies but ignore postinstall scripts like prisma generate
RUN npm install --ignore-scripts

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:docker"]

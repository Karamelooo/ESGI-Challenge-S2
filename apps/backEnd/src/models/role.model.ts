import type { Document, ObjectId } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

interface IRole extends Document {
  name: string
  permissions: [string]
}

const roleSchema = new Schema({
    name: { type: String, required: true },
    permissions: [String], // a voir psk j'ai pas beaucoup d'idée de comment faire, on peux aussi retirer cette ligne
});

const Role = mongoose.model<IRole>('Role', roleSchema);

export default Role
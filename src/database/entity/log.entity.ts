import { PatternEntity } from "src/common/patternEntity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Log extends PatternEntity {
    @Column()
    message: string 

    @Column({default: false})
    hasRead: boolean

    @Column()
    receiverId: string

    @ManyToOne(()=>User)
    receiver: User

    @Column()
    href: string
    
 }


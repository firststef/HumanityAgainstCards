package org.example;

import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

import java.util.ArrayList;
import java.util.List;

public class DatabaseHandler {
    MongoDatabase database = Database.get_database();
    List<Document> whiteCards = new ArrayList<>();
    List<Document> blackCards = new ArrayList<>();

    void init(){
        database.getCollection("white_cards").find().forEach(whiteCards::add);
        database.getCollection("black_cards").find().forEach(blackCards::add);
    }

    Document getBlackCard() {
        return blackCards.get((int) (Math.random() * blackCards.size()));
    }

    List<Document> getWhiteCards(){
        List<Document> tmp = new ArrayList<>();
        for(int i = 0 ; i<10 ;i++){
            tmp.add(whiteCards.get((int) (Math.random() * whiteCards.size())));
        }
        return tmp;
    }

    public void updateDatabase(Document blackCard, Document whiteCard) {
        Document relation1 = database
                .getCollection("blackcard_whitecard_relation")
                .find(and(eq("whiteCardId",whiteCard.getInteger("_id")),eq("blackCardId",blackCard.getInteger("_id"))))
                .first();

        database.getCollection("blackcard_whitecard_relation")
                .updateOne(
                        and(eq("whiteCardId",whiteCard.getInteger("_id")),eq("blackCardId",blackCard.getInteger("_id"))),
                        set("value",relation1.getInteger("value") + 5));
    }
}

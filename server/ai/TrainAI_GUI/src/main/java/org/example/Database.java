package org.example;

import com.mongodb.ConnectionString;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Database implements AutoCloseable {

    private static MongoDatabase database = null;
    private static MongoClient mongoClient = null;

    private Database(){
        Logger mongoLogger = Logger.getLogger("org.mongodb.driver");
        mongoLogger.setLevel(Level.OFF);
        try {
            mongoClient = MongoClients.create(new ConnectionString("mongodb+srv://fluffypanda:thefluffa5@humanityagainstcards-vfnzh.gcp.mongodb.net/test?retryWrites=true&w=majority"));
            database = mongoClient.getDatabase("HumansAgainstCards");
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    static MongoDatabase get_database(){
        if(database == null)
            new Database();
        return database;
    }

    @Override
    public void close() throws IOException {
        mongoClient.close();
    }
}

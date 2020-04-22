package org.example;

import org.bson.Document;

import javax.swing.*;

public class WhiteCardButton extends JButton {

    MainFrame frame;
    public boolean state;
    Document whiteCard;
    String text;

    WhiteCardButton(MainFrame frame, Document whiteCard){
        this.frame = frame;
        this.state = false;
        this.whiteCard = whiteCard;
        text = frame.parseText(whiteCard.getString("text"));
        this.setText(text);
        addActionListener(e -> {
            state = !state;
            if(text.contains("(Selected)"))
                text=text.replace("(Selected)","");
            else text=text.replace("</html>","(Selected)</html>");
            this.setText(text);
            this.frame.revalidate();
            this.frame.repaint();
            this.frame.checkEnoughButtons();
        });
    }
}

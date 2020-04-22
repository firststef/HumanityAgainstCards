package org.example;

import org.bson.Document;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;


public class MainFrame extends JFrame {
    DatabaseHandler dbh = new DatabaseHandler();
    JPanel mainPanel;
    Document blackCard;
    List<Document> whiteCards;
    List<WhiteCardButton> whiteButtons = new ArrayList<>();
    int pick;

    public MainFrame() {
        super("TrainAI");
        dbh.init();
        mainPanel = new JPanel();
        mainPanel.setLayout(new GridLayout(3,1));
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        setPreferredSize(new Dimension(screenSize.width, screenSize.height));
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        init();
    }
    private void init() {
        blackCard = dbh.getBlackCard();
        whiteCards = dbh.getWhiteCards();
        whiteButtons.clear();

        mainPanel.removeAll();
        pick = blackCard.getInteger("pick");
        JPanel blackCardPanel = getCardPanel(parseText(blackCard.getString("text") + " \n Pick " + pick + " cards."));

        JPanel whiteRows = getwhiteRowPanel();
        JButton skipButton = new JButton("Skip question");
        skipButton.addActionListener(e -> resetFrame());

        mainPanel.add(blackCardPanel);
        mainPanel.add(whiteRows);
        mainPanel.add(skipButton);

        this.add(mainPanel);

        this.pack();
    }

    private void resetFrame() {
        this.init();
        mainPanel.repaint();
    }

    public String parseText(String text) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html>");

        String[] words = text.split(" ");

        int length = 0;

        for (String word : words) {
            sb.append(word).append(" ");
            length += word.length() + 1;
            if (length > 20) {
                length = 0;
                sb.append("<br>");
            }
        }
        sb.append("</html>");

        return sb.toString();
    }

    private JPanel getwhiteRowPanel() {
        JPanel whiteRow = new JPanel(new GridLayout(2,5));
        whiteRow.setBorder(BorderFactory.createEtchedBorder());

        for(int i=0 ; i<10 ; i++){
            WhiteCardButton whiteCard = new WhiteCardButton(this,whiteCards.get(i));
            whiteButtons.add(whiteCard);
            whiteRow.add(whiteCard);
        }

        return whiteRow;
    }

    private JPanel getCardPanel(String text) {
        JPanel whiteCard = new JPanel(new BorderLayout());
        whiteCard.setBorder(BorderFactory.createEtchedBorder());
        JLabel label1 =  new JLabel(text);
        label1.setHorizontalAlignment(SwingConstants.CENTER);
        whiteCard.add(label1,BorderLayout.CENTER);
        return whiteCard;
    }

    public void checkEnoughButtons() {
        int picked = 0;
        for(WhiteCardButton i : whiteButtons) {
            if (i.state)
                picked++;
        }

        if(picked>=pick){
            for(WhiteCardButton i : whiteButtons) {
                if (i.state)
                    dbh.updateDatabase(blackCard, i.whiteCard);
            }
            resetFrame();
        }
    }


}
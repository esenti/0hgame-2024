class Game extends Phaser.Scene
{
    preload ()
    {
        this.load.spritesheet("person", "img/person.png", {
            frameWidth: 128,
            frameHeight: 128,
        });

        this.load.image("no", "img/no.png");
        this.load.image("bg", "img/bg.png");
        this.load.image("bubble", "img/bubble.png");
    }

    create ()
    {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('person', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        })

        this.anims.create({
            key: 'talking_shit',
            frames: this.anims.generateFrameNumbers('person', { start: 2, end: 2 }),
            frameRate: 2,
            repeat: -1
        })

        this.panelists = []
        this.states = []
        this.timers = []
        this.texts = []
        this.bubbles = []
        this.score = 0

        this.add.sprite(400, 300, "bg");

        this.scoreText = this.add.text(400, 100, this.score, {
            color: "#000000",
            fontSize: "30px"
        })

        for (let i = 0; i < 4; i++)
        {
            const person = this.add.sprite(230 + 150 * i, 300, 'person').setInteractive();
            person.anims.play("idle");
            const bubble = this.add.sprite(230 + 150 * i, 200, 'bubble')
            bubble.visible = false;
            this.bubbles.push(bubble);
            
            this.panelists.push(person);
            this.states.push(0)
            this.timers.push(0)

            const emitter = this.add.particles(230 + 150 * i, 300, "no", {
                speed: 100,
                scale: { start: 1, end: 0 },
                lifespan: {min: 500, max: 1500},
                quantity: 0
            })

            person.on('pointerdown', () => {
                if (this.states[i] == 1)
                {
                    emitter.explode(30);
                    const s = Math.max(0, 2000 - this.timers[i]);
                    const t = this.add.text(230 + 150 * i, 200, s.toFixed(), {
                        color: s > 0 ? "#000000" : "#aa0000",
                    });
                    this.texts.push(t)

                    this.time.addEvent({
                        "delay": 1000,
                        "callback": () => {
                            t.destroy();
                        }
                    });

                    this.score += s;
                    this.scoreText.text = this.score.toFixed(); 

                    this.bubbles[i].visible = false;
                    this.states[i] = 0;
                    person.anims.play("idle");
                }
            })
        }

    }

    update (time, delta)
    {
        for (let i = 0; i < this.panelists.length; i++)
        {
            this.timers[i] += delta;

            if (this.states[i] == 0)
            {
                if (Math.random() < 0.01)
                {
                    this.states[i] = 1;
                    this.timers[i] = 0;
                    this.panelists[i].anims.play("talking_shit");
                    this.bubbles[i].visible = true;
                }
            }
        }

        for (let i = 0; i < this.texts.length; i++)
        {
            this.texts[i].y -= delta * 0.05;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Game,
    backgroundColor: "#ffffff",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);
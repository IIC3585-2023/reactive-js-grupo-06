export class Pellet {
  constructor({ position }) {
    this.position = position;
    this.radius = 5;
    this.color = "white";
  }

  draw() {
    c.beginPath();
    c.arc(
      this.position.x + this.radius,
      this.position.y + this.radius,
      this.radius,
      0,
      Math.PI * 2
    );
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    console.log(this.position);
  }
}

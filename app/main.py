from flask import Flask, Blueprint, render_template, send_from_directory
import os

app = Flask(__name__)
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    """Home page route."""
    return render_template('home.html', title='Ecological Text Editing Services')

@main_bp.route('/static/assets/images/<path:filename>')
def serve_image(filename):
    """Serve images from the static/assets/images directory."""
    return send_from_directory(os.path.join(app.root_path, 'static', 'assets', 'images'), filename)

app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True)

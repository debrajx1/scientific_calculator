import re
from flask import Flask, render_template, request, jsonify
import math
import numpy as np

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        expression = request.json.get('expression', '')

        if not expression:
            return jsonify({"error": "Empty expression"})

        # Fix: Convert trigonometric functions from degrees to radians correctly
        def convert_trig(match):
            func, number = match.groups()
            try:
                return f"{func}(math.radians({float(number)}))"
            except ValueError:
                return f"{func}({number})"  # Keep as is if conversion fails

        expression = re.sub(r'\b(sin|cos|tan)\(([^)]+)\)', convert_trig, expression)

        # Fix: Safer matrix evaluation function to prevent invalid inputs
        def safe_matrix_eval(expr):
            try:
                return np.array(eval(expr, {"__builtins__": None}, {"array": np.array, "list": list}))
            except Exception as e:
                return f"Error: Invalid matrix input - {str(e)}"        

        # Safe math functions dictionary
        safe_dict = {
            "sin": math.sin, "cos": math.cos, "tan": math.tan,
            "asin": math.asin, "acos": math.acos, "atan": math.atan,
            "sqrt": math.sqrt, "ln": math.log, "log10": math.log10,
            "exp": math.exp, "pow": math.pow, "pi": math.pi, "e": math.e,
            "abs": abs, "factorial": math.factorial,
            "radians": math.radians, "degrees": math.degrees,

            # Fix: Complex Mode - Ensure proper evaluation
            "real": lambda x: complex(eval(x, {"__builtins__": None}, safe_dict)).real,
            "imag": lambda x: complex(eval(x, {"__builtins__": None}, safe_dict)).imag,
            "conj": lambda x: complex(eval(x, {"__builtins__": None}, safe_dict)).conjugate(),
            "arg": lambda x: math.atan2(complex(eval(x, {"__builtins__": None}, safe_dict)).imag, 
                            complex(eval(x, {"__builtins__": None}, safe_dict)).real),

            # Programming Mode (Fixed)
            "bin": lambda x: bin(int(x))[2:],  # Convert to binary without '0b'
            "hex": lambda x: hex(int(x))[2:],  # Convert to hex without '0x'
            "oct": lambda x: oct(int(x))[2:],  # Convert to octal without '0o'

            "AND": lambda x, y: str(int(x) & int(y)),  # Bitwise AND
            "OR": lambda x, y: str(int(x) | int(y)),   # Bitwise OR
            "XOR": lambda x, y: str(int(x) ^ int(y)),  # Bitwise XOR

            # Statistics Mode
            "mean": lambda *args: sum(args) / len(args) if args else None,
            "median": lambda *args: sorted(args)[len(args) // 2] if args else None,
            "stddev": lambda *args: (sum((x - sum(args)/len(args))**2 for x in args) / len(args))**0.5 if args else None,

            # Matrix Mode (Fixed)
            "matrix": safe_matrix_eval,  # ✅ Safely evaluates matrices
            "det": lambda x: round(float(np.linalg.det(np.array(x))), 5) if np.linalg.det(np.array(x)) != 0 else "Error: Singular Matrix",
            "inv": lambda x: np.linalg.inv(np.array(x)).tolist() if np.linalg.det(np.array(x)) != 0 else "Error: Singular Matrix",
            "dot": lambda x, y: np.dot(np.array(x), np.array(y)).tolist(),
        }

        # Secure evaluation
        try:
            result = eval(expression, {"__builtins__": None}, safe_dict)
        except Exception as e:
            result = f"Error: {str(e)}"

        return jsonify({"result": str(result)})

    except Exception as e:
        print(f"Error: {e}")  # Debugging
        return jsonify({"error": "Invalid Expression"})

if __name__ == '__main__':
    app.run(debug=True)      

                                                 
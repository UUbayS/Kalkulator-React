import { useState } from "react";
import "./App.css";

function App() {
  const [displayValue, setDisplayValue] = useState("0");
  const [expression, setExpression] = useState(""); // Untuk menyimpan ekspresi lengkap
  const [parenthesesCount, setParenthesesCount] = useState(0); // Menghitung kurung terbuka

  // Fungsi untuk menangani input angka
  const handleDigitClick = (digit) => {
    if (displayValue === "0" || displayValue === "Error") {
      setDisplayValue(String(digit));
      setExpression(expression + digit);
    } else {
      setDisplayValue(displayValue + digit);
      setExpression(expression + digit);
    }
  };

  // Fungsi untuk menangani input desimal (.)
  const handleDecimalClick = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
      setExpression(expression + ".");
    }
  };

  // Fungsi untuk menangani operator (+, -, *, /)
  const handleOperatorClick = (nextOperator) => {
    const lastChar = expression.slice(-1);
    
    // Jika karakter terakhir adalah operator, ganti dengan operator baru
    if (["+", "-", "*", "/", "×", "÷", "−"].includes(lastChar)) {
      setExpression(expression.slice(0, -1) + nextOperator);
    } else {
      setExpression(expression + nextOperator);
    }
    
    setDisplayValue(nextOperator);
  };

  // Fungsi untuk menangani kurung buka
  const handleOpenParenthesesClick = () => {
    setExpression(expression + "(");
    setDisplayValue("(");
    setParenthesesCount(parenthesesCount + 1);
  };

  // Fungsi untuk menangani kurung tutup
  const handleCloseParenthesesClick = () => {
    if (parenthesesCount > 0) {
      setExpression(expression + ")");
      setDisplayValue(")");
      setParenthesesCount(parenthesesCount - 1);
    }
  };

  // Fungsi helper untuk mengecek apakah karakter adalah angka
  const isNumber = (char) => {
    return !isNaN(char) && char !== " ";
  };

  // Fungsi untuk evaluasi ekspresi dengan kurung
  const evaluateExpression = (expr) => {
    try {
      // Ganti simbol operator untuk evaluasi JavaScript
      let processedExpr = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

      // Evaluasi menggunakan Function constructor (lebih aman dari eval)
      const result = Function('"use strict"; return (' + processedExpr + ')')();
      
      if (!isFinite(result)) {
        return "Error";
      }
      
      return result;
    } catch (error) {
      return "Error";
    }
  };

  // Fungsi untuk menangani tombol sama dengan (=)
  const handleEqualsClick = () => {
    if (expression) {
      // Tutup semua kurung yang masih terbuka
      let finalExpression = expression;
      for (let i = 0; i < parenthesesCount; i++) {
        finalExpression += ")";
      }
      
      const result = evaluateExpression(finalExpression);
      setDisplayValue(String(result));
      setExpression(String(result));
      setParenthesesCount(0);
    }
  };

  // Fungsi untuk membersihkan display (AC)
  const handleClearClick = () => {
    setDisplayValue("0");
    setExpression("");
    setParenthesesCount(0);
  };

  // Fungsi untuk menghapus karakter terakhir (CE)
  const handleClearEntryClick = () => {
    if (expression.length > 0) {
      const lastChar = expression.slice(-1);
      
      if (lastChar === "(") {
        setParenthesesCount(parenthesesCount - 1);
      } else if (lastChar === ")") {
        setParenthesesCount(parenthesesCount + 1);
      }
      
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      
      // Logika untuk menampilkan nilai yang benar pada display
      if (newExpression.length === 0) {
        setDisplayValue("0");
      } else {
        // Cari angka atau operator terakhir dalam expression
        const operators = ['+', '-', '×', '÷', '(', ')'];
        let lastNumberStart = newExpression.length;
        
        // Cari posisi operator terakhir
        for (let i = newExpression.length - 1; i >= 0; i--) {
          if (operators.includes(newExpression[i])) {
            lastNumberStart = i + 1;
            break;
          }
          if (i === 0) {
            lastNumberStart = 0;
          }
        }
        
        // Ambil bagian terakhir (angka atau operator)
        const lastPart = newExpression.slice(lastNumberStart);
        
        // Jika bagian terakhir kosong atau hanya operator, tampilkan operator terakhir
        if (lastPart === "" || operators.includes(lastPart)) {
          setDisplayValue(newExpression.slice(-1) || "0");
        } else {
          // Jika bagian terakhir adalah angka, tampilkan angka lengkap
          setDisplayValue(lastPart || "0");
        }
      }
    }
  };

  // Render komponen ke layar (tampilan UI)
  return (
    <div className="calculator">
      <div className="display">
        <div className="expression">{expression || "0"}</div>
        <div className="result">{displayValue}</div>
      </div>
      <div className="keypad">
        <div className="input-keys">
          <div className="function-keys">
            <button className="key key-ac" onClick={handleClearClick}>
              AC
            </button>
            <button className="key key-ce" onClick={handleClearEntryClick}>
              CE
            </button>
          </div>
          <div className="digit-keys">
            <button className="key key-7" onClick={() => handleDigitClick(7)}>
              7
            </button>
            <button className="key key-8" onClick={() => handleDigitClick(8)}>
              8
            </button>
            <button className="key key-9" onClick={() => handleDigitClick(9)}>
              9
            </button>
            <button className="key key-4" onClick={() => handleDigitClick(4)}>
              4
            </button>
            <button className="key key-5" onClick={() => handleDigitClick(5)}>
              5
            </button>
            <button className="key key-6" onClick={() => handleDigitClick(6)}>
              6
            </button>
            <button className="key key-1" onClick={() => handleDigitClick(1)}>
              1
            </button>
            <button className="key key-2" onClick={() => handleDigitClick(2)}>
              2
            </button>
            <button className="key key-3" onClick={() => handleDigitClick(3)}>
              3
            </button>
            <button className="key key-0" onClick={() => handleDigitClick(0)}>
              0
            </button>
            <button className="key key-dot" onClick={handleDecimalClick}>
              .
            </button>
          </div>
        </div>
        <div className="operator-keys">
          <button className="key key-open-paren" onClick={handleOpenParenthesesClick}>
            (
          </button>
          <button className="key key-close-paren" onClick={handleCloseParenthesesClick}>
            )
          </button>
          <button className="key key-divide" onClick={() => handleOperatorClick("÷")}>
            ÷
          </button>
          <button className="key key-multiply" onClick={() => handleOperatorClick("×")}>
            ×
          </button>
          <button className="key key-subtract" onClick={() => handleOperatorClick("−")}>
            −
          </button>
          <button className="key key-add" onClick={() => handleOperatorClick("+")}>
            +
          </button>
          <button className="key key-equals" onClick={handleEqualsClick}>
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
